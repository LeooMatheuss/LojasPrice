"use strict";
import amazon from "./amazon.js";
import kabum from "./kabum.js";
import { remote } from "webdriverio";
import fs from "fs";

class index {
  async webconfig() {
    global.browser = await remote({
      capabilities: {
        browserName: "chrome",
        "goog:chromeOptions": {
          args: process.env.CI ? ["headless", "disable-gpu"] : [],
        },
      },
    });
  }

  async start() {
    const produto = "iPhone 15 Pro Max 256 GB";
    fs.writeFileSync("./result.json", "[]");
    await this.webconfig();
    const resultKabum = await new kabum().execute(produto);
    const resultAmazon = await new amazon().execute(produto);
  
    await browser.closeWindow().catch(() => null);

    let produtosSalvos = resultKabum.concat(resultAmazon);
    fs.writeFileSync("./result.json", JSON.stringify(produtosSalvos,null,2));
    const produtomenorvalor = this.filterproduct(produtosSalvos, produto);
    console.log(produtomenorvalor);
  }

  filterproduct(produtos, nomeproduto) {
    const parseValor = (valor) => {
      return parseFloat(valor.replace(".", "").replace(",", "."));
    };

   
    return produtos.reduce((menor, atual) => {
      if (!atual.produto.includes(nomeproduto)) return menor;

      const valorMenor = parseValor(menor.valor);
      const valorAtual = parseValor(atual.valor);

      return valorAtual < valorMenor ? atual : menor;
    });
  }
}
new index().start();
