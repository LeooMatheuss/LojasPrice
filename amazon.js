" use strict";

import Utils from "./utils.js";
import cheerio from "cheerio";
import fs from "node:fs";

export default class main {
  get siteurl() {
    return "https://www.amazon.com.br/";
  }

  get search() {
    return '[id="twotabsearchtextbox"]';
  }

  get captcha() {
    return '[src*="/captcha/"]';
  }

  async execute(produto) {
    const utils = new Utils();

    await browser.url(this.siteurl);
    await utils.pageIsComplete();
    if (await browser.$(this.captcha).isDisplayed()) {
      console.log("favor resolver o captcha da tela");
      await browser.debug();
      await utils.pageIsComplete();
    }
    
    await browser.$(this.search).setValue(produto);
    await browser.keys("Enter");
    await utils.pageIsComplete();

   // await browser.debug();

    await browser
      .$("body")
      .saveScreenshot(produto.replace(/\s+/g, "_") + "-amazon.png");
    const HtmlProdut = await browser.$('[data-component-type="s-search-results"]').getHTML();

    const $ = cheerio.load(HtmlProdut);
    return $('[data-component-type="s-search-result"]')
      .get()
      .map((cardProduto) => {
        return {
          loja: "amazon",
          produto: $(cardProduto).find('[data-cy="title-recipe"] h2').text(),
          valor: $(cardProduto)
            .find('[data-cy="price-recipe"] [data-a-color="base"] .a-offscreen')
            .text()
            .replace(/R\$\s*/, ""),

        };
      });
  }
}

//module.exports = new main();
