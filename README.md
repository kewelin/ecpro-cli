# ECPRO CLI

在終端機秒查台灣網站的開店平台、技術、廣告投放與競品。資料來源 [ECPRO 電商博士](https://ecpro.tw)。

```bash
npx ecpro pinkoi.com
npx ecpro pinkoi.com --competitors
npx ecpro pinkoi.com --json
```

需要 Node 18+。環境變數 `ECPRO_API_BASE` 可改 API 位址（預設 `https://ecpro.tw/api/v1`）。

發布：`cd ecpro-cli && npm publish`
