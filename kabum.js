" use strict";

import Utils from "./utils.js";
import cheerio from "cheerio";
import fs, { writeFileSync } from "node:fs";

export default class main {
  get siteurl() {
    return "https://www.kabum.com.br/";
  }

  get search() {
    return'[id="input-busca"]' ;
  }

  async execute(produto) {
    const utils = new Utils();

    await browser.url(this.siteurl);
    await utils.pageIsComplete();

    await browser.$(this.search).setValue(produto);
    await browser.keys("Enter");
    await utils.pageIsComplete();

    await browser.$("body").saveScreenshot(produto.replace(/\s+/g,"_")+"-kabum.png");
    const HtmlProdut = await browser.$("#listing").getHTML();

    const $ = cheerio.load(HtmlProdut);
    return $("#listingOrdenation").parent().find("main > div")
      .get()
      .map((cardProduto) => {
        return {
          loja: "kabum",
          produto: $(cardProduto).find(".nameCard").text(),
          valor: $(cardProduto).find(".priceCard").text().replace(/R\$\s*/, ""),
        };
      });
  }
}

//module.exports = new main();
