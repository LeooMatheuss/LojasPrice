"use strict";

export default class utils {
  async pageIsComplete() {
    const status = await browser.execute("document.readyState");
    await browser.pause(2000);
    //console.log(status);
    if (status != "complete") return await pageIsComplete();
  }
}

//module.execute = new utils()