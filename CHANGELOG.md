# [2.0.0](https://github.com/WTW-IM/scriptloader-component/compare/v1.5.4...v2.0.0) (2022-12-01)


### Breaking

* updating package to use ES modules file as main module ([e9ddd26](https://github.com/WTW-IM/scriptloader-component/commit/e9ddd263676e1690c702edb9bf092f37c2792fc8))

### Update

* exporting dist and module files ([9702141](https://github.com/WTW-IM/scriptloader-component/commit/97021418eb295cf80808696c0efd9d91724ed06d))
* updating packages ([deab6ec](https://github.com/WTW-IM/scriptloader-component/commit/deab6ec1f021463a57957d21c66ee1748119b372))

## [1.5.4](https://github.com/WTW-IM/scriptloader-component/compare/v1.5.3...v1.5.4) (2022-11-11)


### Patch

* add children to ScriptLoaderProps ([86cf8b3](https://github.com/WTW-IM/scriptloader-component/commit/86cf8b387630b363b0c54b8ecdb36c24c3370d2d))

## [1.5.3](https://github.com/WTW-IM/scriptloader-component/compare/v1.5.2...v1.5.3) (2022-11-11)


### Build

* use node latest lts for builds ([6f400cd](https://github.com/WTW-IM/scriptloader-component/commit/6f400cd07dc27898c82dda0b9d432b517067cc5a))

### Fix

* ensure Success/Failed/Loading types match export ([263760d](https://github.com/WTW-IM/scriptloader-component/commit/263760d5d55a676fa535652694345a11eaca4a8f))

## [1.5.2](https://github.com/WTW-IM/scriptloader-component/compare/v1.5.1...v1.5.2) (2022-10-03)


### Build

* ensuring we use pipeline bot pat for checkout ([b43826e](https://github.com/WTW-IM/scriptloader-component/commit/b43826e7fe3747f9d612bf72a0e6b3598e5e7474))
* persist gh credentials ([84d1b29](https://github.com/WTW-IM/scriptloader-component/commit/84d1b296b6f9cba347a68b6ca39dfbdb4a36ac2a))
* use semantic-release-actionv3 ([a0b62df](https://github.com/WTW-IM/scriptloader-component/commit/a0b62df849a7ba59788c3c44e8fd4cb1ceb9bef4))

### Fix

* react 18 children support ([9135d1b](https://github.com/WTW-IM/scriptloader-component/commit/9135d1b8255c76ebf226715ed9c81404a803eab4))

## [1.5.1](https://github.com/WTW-IM/scriptloader-component/compare/v1.5.0...v1.5.1) (2021-01-25)


### Fix

* exporting correct type for useScriptLoader ([dbd49b6](https://github.com/WTW-IM/scriptloader-component/commit/dbd49b696105d6954b46bb39c63dff2ca6dc7d1b))

# [1.5.0](https://github.com/WTW-IM/scriptloader-component/compare/v1.4.2...v1.5.0) (2021-01-23)


### Update

* making sure we export things appropriately ([c56e2a1](https://github.com/WTW-IM/scriptloader-component/commit/c56e2a11c3e799e887f7cce9bb37e9d6526331ec))

## [1.4.2](https://github.com/WTW-IM/scriptloader-component/compare/v1.4.1...v1.4.2) (2021-01-20)


### Build

* adding publishing to PRs for prerelease versions ([4dc2f3d](https://github.com/WTW-IM/scriptloader-component/commit/4dc2f3d175c617530417e6effd189469c2de6a16))
* attempting to add PR comments for prerelease versions ([bb03f31](https://github.com/WTW-IM/scriptloader-component/commit/bb03f311c297f153e4e9b9c094fc82e272f468ba))
* deleting im-pipeline-bot PR comments before adding new ones ([c4b2ada](https://github.com/WTW-IM/scriptloader-component/commit/c4b2ada5736689d035cd6ad9da9b19b6d91b1ad9))
* improving PR commenting ([8c238cf](https://github.com/WTW-IM/scriptloader-component/commit/8c238cfe1601b7dfa78c31f706ac8d66c8a7d24c))
* running publish on all branches ([105a729](https://github.com/WTW-IM/scriptloader-component/commit/105a729fcb0afef98058436afc676620edf1166f))
* setting up prerelease PR interaction ([07fcdde](https://github.com/WTW-IM/scriptloader-component/commit/07fcdde43a4c101255670ef856af63ab69e96b20))
* updating PRs with internal prerelease @semantic-release plugin ([bfa9c3d](https://github.com/WTW-IM/scriptloader-component/commit/bfa9c3dd73a76b6f6bedec85f6d445f56bc6348d))

### Fix

* ensuring we call back on success while mounted ([3e05d67](https://github.com/WTW-IM/scriptloader-component/commit/3e05d67d0df24aff74422b743c0eb98df82efdd8))
* fixing a small spelling error in scriptCache.ts ([3d74ee4](https://github.com/WTW-IM/scriptloader-component/commit/3d74ee49146219efcc094620a9f8c1966d24c757))

### Refactor

* moving script generation into scriptCache ([e18b746](https://github.com/WTW-IM/scriptloader-component/commit/e18b746219a1688f6600eb1d707927f73a5904f7))
* setting up script inside Promise ([875e62f](https://github.com/WTW-IM/scriptloader-component/commit/875e62f4fbda026c4ac6119b6937f700c9ecf0c3))

## [1.4.1](https://github.com/WTW-IM/scriptloader-component/compare/v1.4.0...v1.4.1) (2021-01-14)


### Fix

* fixing a bug where webpack would break due to exports named twice ([c57c97e](https://github.com/WTW-IM/scriptloader-component/commit/c57c97e30d19694a5704385759511e72d76ca787))

# [1.4.0](https://github.com/WTW-IM/scriptloader-component/compare/v1.3.0...v1.4.0) (2021-01-13)


### New

* exporting scriptloader-support to be used outside of React ([b3b1f89](https://github.com/WTW-IM/scriptloader-component/commit/b3b1f89fd9aec7cbca14209f6fddee176a2ef3c5))

### Update

* utilizing promises for loading scripts ([e472016](https://github.com/WTW-IM/scriptloader-component/commit/e4720169ea711f2feb3b5d1d6bb282a7218f5bcf))

# [1.3.0](https://github.com/WTW-IM/scriptloader-component/compare/v1.2.2...v1.3.0) (2021-01-05)


### Fix

* ensuring we only define window properties once ([35fb37c](https://github.com/WTW-IM/scriptloader-component/commit/35fb37ce7a77654bb8473b629a9927aa699918fc))

### Update

* exporting useScriptLoader appropriately ([ecd0e06](https://github.com/WTW-IM/scriptloader-component/commit/ecd0e06df547f0a18700e14e828dc4e0062abbed))

## [1.2.2](https://github.com/WTW-IM/scriptloader-component/compare/v1.2.1...v1.2.2) (2020-12-02)


### Fix

* ensuring dist is always built before pack/publish ([808a5ff](https://github.com/WTW-IM/scriptloader-component/commit/808a5ff0cc4cdfdddf0ed1e570ebab9c4b6b06d3))

## [1.2.1](https://github.com/WTW-IM/scriptloader-component/compare/v1.2.0...v1.2.1) (2020-12-02)


### Fix

* correcting package.json files ([0a9ec94](https://github.com/WTW-IM/scriptloader-component/commit/0a9ec94b3623bf80a2c9b4e0a754e425fcb2e6ea))

# [1.2.0](https://github.com/WTW-IM/scriptloader-component/compare/v1.1.1...v1.2.0) (2020-12-02)


### Update

* exporting ScripLoader as default from root file ([b3ae460](https://github.com/WTW-IM/scriptloader-component/commit/b3ae460a066f64f89c5de7a0f0cc893a3134d7a5))

## [1.1.1](https://github.com/WTW-IM/scriptloader-component/compare/v1.1.0...v1.1.1) (2020-12-02)


### Build

* adding some extra tags for conventional commits ([57af2f7](https://github.com/WTW-IM/scriptloader-component/commit/57af2f72ab1f64df1da1937019f219c6c6e00372))
* allowing for other patch type commits ([3c7ce28](https://github.com/WTW-IM/scriptloader-component/commit/3c7ce285ccc4fd4bb33a28c57666cb57d9f57ad9))
* ensuring we checkout files before other jobs ([54a8452](https://github.com/WTW-IM/scriptloader-component/commit/54a8452c7e650bc77c0b68b8e3e8f903a9273350))
* removing needs from test in npm-publish ([45f4afe](https://github.com/WTW-IM/scriptloader-component/commit/45f4afe446cde7f87f6b38a231a42f2490f0bdf8))
* running test before release ([a7d8c4a](https://github.com/WTW-IM/scriptloader-component/commit/a7d8c4a3a032e31b11b8ba37784e9d8c7eab6652))

### Refactor

* creating a default cached script ([e29e5cb](https://github.com/WTW-IM/scriptloader-component/commit/e29e5cbaee8f61333e7806824f7c5af76bf16705))

# [1.1.0](https://github.com/WTW-IM/scriptloader-component/compare/v1.0.0...v1.1.0) (2020-12-02)


### Build

* ensuring we skip builds on [skip ci] commits ([e2fb21c](https://github.com/WTW-IM/scriptloader-component/commit/e2fb21c9734b697fd38b1079c15a897456b26149))
* updating commitlint to match conventional-changelog-eslint ([92d6bf1](https://github.com/WTW-IM/scriptloader-component/commit/92d6bf108ffe02380a974dc6a0749b9fed06ca55))

### Chore

* moving script updater lookup to a function ([3a4ebe0](https://github.com/WTW-IM/scriptloader-component/commit/3a4ebe02f05560e32bbdc1c44cba450687836312))

### Update

* renaming getScriptUpdaters to getCachedScriptUpdaters ([8634054](https://github.com/WTW-IM/scriptloader-component/commit/86340541a4624394359fae46dd69a7a390dec7b5))

# 1.0.0 (2020-12-02)


### Build

* adding main branch to the configuration for semantic-release ([9db01a3](https://github.com/WTW-IM/scriptloader-component/commit/9db01a34a8c200d8030880a49c258b9ae7f66438))
* adding NPM Publish workflow ([5cc67fd](https://github.com/WTW-IM/scriptloader-component/commit/5cc67fd08084074ac4c44b499a74320cc0b90e2f))
* adding semantic release configuration ([889fc32](https://github.com/WTW-IM/scriptloader-component/commit/889fc322246d111c0cc487ccba2412d1365d5b0b))
* adding tests around ScriptLoader scenarios ([2567f41](https://github.com/WTW-IM/scriptloader-component/commit/2567f41370dc1f0fb66800584a2df5e537c03df3))
* configuring eslint preset for release notes ([0d1d92e](https://github.com/WTW-IM/scriptloader-component/commit/0d1d92e7c6112d1e9912796704e9c966c04e17bf))
* include dependency install in npm-publish ([254fb9a](https://github.com/WTW-IM/scriptloader-component/commit/254fb9a2c2a9d241875e0d635563dfb08aaf8d06))
* initial node build workflow ([78f978b](https://github.com/WTW-IM/scriptloader-component/commit/78f978b976443bc80896182f23949417ec4f054b))
* renaming GH_TOKEN to GITHUB_TOKEN ([75dda5f](https://github.com/WTW-IM/scriptloader-component/commit/75dda5fd4e4a893773ec1fd8d4f93df4b02e7a95))
* renaming GITHUB_TOKEN to GH_TOKEN for npm-publish workflow ([488a019](https://github.com/WTW-IM/scriptloader-component/commit/488a019e324f505669bdc9c7dbea7004dc642885))
* setting up typescript for publishing ([072745c](https://github.com/WTW-IM/scriptloader-component/commit/072745c9a94032d84b532c461c31a19b5d52a288))
* simplifying eslint config ([7bdbb71](https://github.com/WTW-IM/scriptloader-component/commit/7bdbb7177fbf0bd679fa7c2eae7762e82ef34f7f))
* updating node versions in CI workflow ([4681a2a](https://github.com/WTW-IM/scriptloader-component/commit/4681a2a10fb35e9d0976e322d95416608d375cff))
* using COMMITBOT_ACCESS_TOKEN for the npm-publish workflow. ([08cf105](https://github.com/WTW-IM/scriptloader-component/commit/08cf105935185f6ee51316bf479f9006924a7fae))
* using im-commitbot for semantic-release ([898e004](https://github.com/WTW-IM/scriptloader-component/commit/898e004e96b523881362ee8f1b24e34f8ff1678d))
* using persist-credentials false in checkout action ([8db4810](https://github.com/WTW-IM/scriptloader-component/commit/8db481086235f3fe74bc2b1efd7aa6e0ef6f7f64))
* using run instead of uses for npm-publish ([985b126](https://github.com/WTW-IM/scriptloader-component/commit/985b1262be7682126feef339df9baaa1ac988c51))

### New

* initial work for ScriptLoader ([ff2d25c](https://github.com/WTW-IM/scriptloader-component/commit/ff2d25c28ea0993a86943b56511f0e505f496454))

### Update

* early return when we have already loaded the script ([9cecf81](https://github.com/WTW-IM/scriptloader-component/commit/9cecf810bf49cd086515719685557fdc1977878d))
* moving DOM script interaction into its own hook ([da1fb6b](https://github.com/WTW-IM/scriptloader-component/commit/da1fb6b23baabd875faac1fab11c04ebfb6f561f))
* using an internal Context to determine which children show ([6c5123b](https://github.com/WTW-IM/scriptloader-component/commit/6c5123b1671a6d7265b04e800b6941e1594ed860))
