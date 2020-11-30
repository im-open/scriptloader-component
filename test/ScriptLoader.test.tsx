import React from "react";
import {
  rest,
  context,
  MockedRequest,
  ResponseComposition,
  MockedResponse,
} from "msw";
import { setupServer } from "msw/node";
import { render, screen, waitFor } from "@testing-library/react";
import ScriptLoader, { ScriptLoaderProps } from "../src/ScriptLoader";

type ResponseHandlerContext = typeof context;
interface ResponseHandler {
  (
    req: MockedRequest,
    res: ResponseComposition,
    ctx: ResponseHandlerContext
  ): MockedResponse;
}

const testFileLocation = "/test/file.js";

const setupJsReturn = (ctx: ResponseHandlerContext) => {
  ctx.set("Content-Type", "text/javascript");
};

const jsBody = (
  res: ResponseComposition,
  ctx: ResponseHandlerContext
): MockedResponse => {
  setupJsReturn(ctx);
  return res(ctx.body('var hw = "hello world"'));
};

const server = setupServer(
  rest.get(testFileLocation, ((req, res, ctx) => {
    return jsBody(res, ctx);
  }) as ResponseHandler)
);

const renderLoader = (props: ScriptLoaderProps) =>
  render(
    <ScriptLoader {...props}>
      <ScriptLoader.Loading>Loading...</ScriptLoader.Loading>
      <ScriptLoader.Success>Success!</ScriptLoader.Success>
      <ScriptLoader.Failed>Failed :(</ScriptLoader.Failed>
    </ScriptLoader>
  );

beforeAll(() => server.listen());
afterEach(async () => {
  // Wait for requests to complete
  await waitFor<boolean>(() =>
    Boolean(screen.queryByText("Success!") || screen.queryByText("Failed :("))
  );

  server.resetHandlers();
});
afterAll(() => server.close());

describe("success", () => {
  it("renders success with success", async () => {
    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Success!")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText("Failed :(")).not.toBeInTheDocument();
  });

  it("calls onSuccess with success", async () => {
    const successFunc = jest.fn();
    const errorFunc = jest.fn();
    renderLoader({
      source: testFileLocation,
      onSuccess: successFunc,
      onError: errorFunc,
    });

    await waitFor<void>(() => expect(successFunc).toHaveBeenCalledTimes(1));
    expect(errorFunc).not.toHaveBeenCalled();
  });

  it("renders success if the script already exists on the page and was not added by us", async () => {
    // add script
    const existingScript = document.createElement("script");
    existingScript.setAttribute("src", testFileLocation);
    document.body.append(existingScript);

    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Success!")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryByText("Failed :(")).not.toBeInTheDocument();
  });

  it("calls onSuccess if the script already exists on the page and was not added by us", async () => {
    // add script
    const existingScript = document.createElement("script");
    existingScript.setAttribute("src", testFileLocation);
    document.body.append(existingScript);

    const successFunc = jest.fn();
    const errorFunc = jest.fn();
    renderLoader({
      source: testFileLocation,
      onSuccess: successFunc,
      onError: errorFunc,
    });

    await waitFor<void>(() => expect(successFunc).toHaveBeenCalledTimes(1));
    expect(errorFunc).not.toHaveBeenCalled();
  });

  it("renders success if the script already loaded", async () => {
    // initial load
    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Success!")).toBeInTheDocument();

    render(
      <ScriptLoader source={testFileLocation}>
        <ScriptLoader.Success>We got here!</ScriptLoader.Success>
      </ScriptLoader>
    );
    expect(await screen.findByText("We got here!")).toBeInTheDocument();
  });

  it("calls onSuccess if the script already loaded", async () => {
    // initial load
    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Success!")).toBeInTheDocument();

    const successFunc = jest.fn();
    const errorFunc = jest.fn();
    render(
      <ScriptLoader
        source={testFileLocation}
        onSuccess={successFunc}
        onError={errorFunc}
      >
        <ScriptLoader.Success>Another one!</ScriptLoader.Success>
      </ScriptLoader>
    );

    await waitFor<void>(() => expect(successFunc).toHaveBeenCalledTimes(1));
    expect(errorFunc).not.toHaveBeenCalled();
  });
});

describe("loading", () => {
  it("renders loading while it is loading", async () => {
    server.use(
      rest.get(testFileLocation, ((req, res, ctx) => {
        ctx.delay(200);
        return jsBody(res, ctx);
      }) as ResponseHandler)
    );
    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
    expect(screen.queryByText("Failed :(")).not.toBeInTheDocument();
  });
});

describe("failure", () => {
  const logError = console.error;

  beforeAll(() => {
    // quiet errors
    console.error = () => {
      // noop;
    };
  });

  beforeEach(() => {
    server.use(
      rest.get(testFileLocation, (req, res, ctx) => {
        return res(ctx.status(404, "Test Script Not Found"));
      })
    );
  });

  afterAll(() => {
    console.error = logError;
  });

  it("renders failed when it fails", async () => {
    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Failed :(")).toBeInTheDocument();
    expect(screen.queryByText("Success!")).not.toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("calls onError with failure", async () => {
    const successFunc = jest.fn();
    const errorFunc = jest.fn();
    renderLoader({
      source: testFileLocation,
      onSuccess: successFunc,
      onError: errorFunc,
    });

    await waitFor<void>(() => expect(errorFunc).toHaveBeenCalledTimes(1));
    expect(errorFunc).toHaveBeenCalledWith(expect.any(Event));
    expect(successFunc).not.toHaveBeenCalled();
  });

  it("renders failure if the script already failed", async () => {
    // initial load
    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Failed :(")).toBeInTheDocument();

    render(
      <ScriptLoader source={testFileLocation}>
        <ScriptLoader.Failed>Oh no!</ScriptLoader.Failed>
      </ScriptLoader>
    );
    expect(await screen.findByText("Oh no!")).toBeInTheDocument();
  });

  it("calls onError with the failureEvent if the script already failed", async () => {
    // initial load
    renderLoader({ source: testFileLocation });
    expect(await screen.findByText("Failed :(")).toBeInTheDocument();

    const successFunc = jest.fn();
    const errorFunc = jest.fn();
    render(
      <ScriptLoader
        source={testFileLocation}
        onSuccess={successFunc}
        onError={errorFunc}
      >
        <ScriptLoader.Success>Oh shoot!</ScriptLoader.Success>
      </ScriptLoader>
    );

    await waitFor<void>(() => expect(errorFunc).toHaveBeenCalledTimes(1));
    expect(errorFunc).toHaveBeenCalledWith(expect.any(Event));
    expect(successFunc).not.toHaveBeenCalled();
  });
});
