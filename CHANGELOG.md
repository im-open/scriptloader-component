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
