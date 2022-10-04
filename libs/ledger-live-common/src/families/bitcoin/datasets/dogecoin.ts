import type { CurrenciesData } from "@ledgerhq/types-live";
import type { Transaction } from "../types";
const dataset: CurrenciesData<Transaction> = {
  FIXME_ignoreAccountFields: [
    "bitcoinResources.walletAccount", // it is not "stable"
    "bitcoinResources.utxos", // TODO: fix ordering
  ],
  scanAccounts: [
    {
      name: "dogecoin seed 1",
      apdus: `
      => e04000000d038000002c8000000380000000
      <= 41046f43d57d2a9f37c99cbe27c7980618a923ae5163e21fc5175782298c2121e2fa9b37bf201b584d9ef124bfe219c7666018a6ba62c3d4ce3e5873581686f80c592244473779573358636e33755a4b6f764463364d7a564a6b376b69626859464178764dfccf4c8ba0847377323af76508faf408930518a5ac9e533d99f0c98e127a5cdd9000
      => e016000000
      <= 001e00160108446f6765636f696e04444f47459000
      => e040000015058000002c80000003800000000000000000000000
      <= 4104a96db863149ce3f56efe59ff3236b44377f86265544ffc1909001ec4c4d378194af9c944e781d66b87887cbc859c487c0dcbe6788bb6c322cdcc2ff6b05d01ef22444755694177793169386270626a524571346f6362694d6b6268664e4a383769586e507a3f586786765125f6862524516ba2e74042174fcdd2c00cd83918ce2925449000
      => e016000000
      <= 001e00160108446f6765636f696e04444f47459000
      => e040000009028000002c80000003
      <= 41049cce1ca17dd4e6c2bdbcd7c60ebf73ea99f872330df19b9ba1468acc0b1b59e24d165c57e9054dd3934606bfb04debf46fc002b80a146484aa48a742d7fb9fee2244516248435a634b39686151417738707954724d6e4b77716462535a564b424c536308e282e9a205903ce8b17a8b8f984b6684f2f20c43e2424a6e02969249e69edd9000
      => e04000000d038000002c8000000380000000
      <= 41046f43d57d2a9f37c99cbe27c7980618a923ae5163e21fc5175782298c2121e2fa9b37bf201b584d9ef124bfe219c7666018a6ba62c3d4ce3e5873581686f80c592244473779573358636e33755a4b6f764463364d7a564a6b376b69626859464178764dfccf4c8ba0847377323af76508faf408930518a5ac9e533d99f0c98e127a5cdd9000
      => e040000015058000002c80000003800000010000000000000000
      <= 41041de32cbbc8e7d2c495ab41e76cbf9ed1b3ba09fa64822c243cfe8263f3d5000e0e3cec935dc8f9dc0656433d0f434007461f63e7e156929224ff91170626ee502244434d6e4155795a57727a7370756a464a4874477245316a7751705a7a54676337797a68c6eff74a129411274e6fe444f80086050cc6973d2d6ef5c7286e0fd03d619000
      => e016000000
      <= 001e00160108446f6765636f696e04444f47459000
      => e040000009028000002c80000003
      <= 41049cce1ca17dd4e6c2bdbcd7c60ebf73ea99f872330df19b9ba1468acc0b1b59e24d165c57e9054dd3934606bfb04debf46fc002b80a146484aa48a742d7fb9fee2244516248435a634b39686151417738707954724d6e4b77716462535a564b424c536308e282e9a205903ce8b17a8b8f984b6684f2f20c43e2424a6e02969249e69edd9000
      => e04000000d038000002c8000000380000001
      <= 410431e508fe4348f0f7b687d695d6b822b8c775b9579b38076e5968b39a1c5a0e59fbfb9885ad8a0909aac9a7fa62483d992508ba575d3caa7da5b247d1f23dc7b32244376d61697039567966314b6b724c4e3979324253614e675367676457356555446b89bc0fa0ef377416c3c137b7fd99beec14e3447c6ccf18198ff29e62e68876ac9000
      => e040000015058000002c80000003800000020000000000000000
      <= 41046a1bd4f814b0da621d50274d204a1c562c763df8c4c83b17df13b84a6840b5b3f0a02287b5b7e013484e2ab66b87c5578c9caf307357f0307156b2dde125b286224441763877315447486259315065515774686e51447546737a525545634c38703844e549f452e5250484fb428c7985e7650f362b210084bfb4ec2defe15c7d4c92cc9000
      => e016000000
      <= 001e00160108446f6765636f696e04444f47459000
      => e040000009028000002c80000003
      <= 41049cce1ca17dd4e6c2bdbcd7c60ebf73ea99f872330df19b9ba1468acc0b1b59e24d165c57e9054dd3934606bfb04debf46fc002b80a146484aa48a742d7fb9fee2244516248435a634b39686151417738707954724d6e4b77716462535a564b424c536308e282e9a205903ce8b17a8b8f984b6684f2f20c43e2424a6e02969249e69edd9000
      => e04000000d038000002c8000000380000002
      <= 410498f48ea9a8378c2b970f596eb19341fbd29d14509a524f0a3394884e2f72e3b0dbef6f6eac979d502169be12e57d54da70589b496a01496278164e992ec8f95b22444e5279534a69704e54626a5a466e686457754266477a316b5536643975616d5438be97d940de971fe19c6342bff7dc860118c5306465eecb38564afc6ef72fd3669000
      => e040000015058000002c80000003800000030000000000000000
      <= 41047b168a87b1666e49c9cd64ad42ebd79cb06304b2bb4f8865b1787b6305f3925424f1cc8e2cb3c425553571c6b7f78052e4995374f827e58ad90cadacbd9a44d022444e756975586e394e7a4766734b73366b784b4e396d78424d7732724b354e4a6859d4d8856542db4a3f95e54c880effd0ccf0594700278a609dd838e5a810a90daa9000
      => e016000000
      <= 001e00160108446f6765636f696e04444f47459000
      => e040000009028000002c80000003
      <= 41049cce1ca17dd4e6c2bdbcd7c60ebf73ea99f872330df19b9ba1468acc0b1b59e24d165c57e9054dd3934606bfb04debf46fc002b80a146484aa48a742d7fb9fee2244516248435a634b39686151417738707954724d6e4b77716462535a564b424c536308e282e9a205903ce8b17a8b8f984b6684f2f20c43e2424a6e02969249e69edd9000
      => e04000000d038000002c8000000380000003
      <= 4104c666a5b68667a55d893d2537478ecbf6f7890fe61c02b67a68b796062a48bc5d0d1b09216c38d39f725bc8e71eb59628b318d7d0e1f36e46195cbed0cb2ea51522445356736e76334450584c5a6561374c6138687279324579464456346e78527275413e35c5b48e47e44e2e9a3aa17748be45c5970b3e4f01e31e457a1521cd58c8399000
      `,
    },
  ],
};
export default dataset;
