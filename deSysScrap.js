const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const url = 'https://sketch.cloud/s/RWYZ8';
    await page.goto(url, { waitUntil: 'networkidle2' });
    let data = await page.evaluate(() => {
        let secciones = [];
        let data = document.querySelectorAll('div.sc-bqjOQT.nNzki.sc-gGCbJM.eFMOWl');
        //data = Array.from(data);
        data.forEach( (section) => {
            let name = section.querySelector('h2').innerText;
            let parts = section.querySelectorAll('div.sc-iNhVCk.kpbDDZ');
            let links = [];
            parts.forEach( (part) => {
                links.push(part.querySelector('a').getAttribute('href'));
            });
            secciones.push({
                S_name: name,
                S_links: links
            });
        });
        return secciones;
    });
    console.log(data);

    for (let section of data) {
        let sectionName = section.S_name;
        let iteration = 0;
        for (let link of section.S_links) {
            await page.goto(url+link, { waitUntil: 'networkidle2' });
            await page.setViewport({ width: 1920, height: 1070 });
            await page.screenshot({path: './deSys/'+sectionName+iteration+'.png'});
            iteration++;
        };

        console.log('Done With '+sectionName);
        console.log('Proxima Section');
    };

    // ------------
    // await page.goto('https://www.afkarena.net/'+data[0].name, { waitUntil: 'networkidle2' });
    // await page.screenshot({path: './afk/'+data[0].name+1+'.png'});

    // for (let hero of data) {
    //     await page.goto(hero.link)
    //     await page.setViewport({ width: 1920, height: 1070 });
    //     await page.screenshot({path: './afk/'+hero.name+'.png'});
    // };
    // ------------

    //   data.forEach( async (hero) => {
    //       await page.goto('https://www.afkarena.net/'+hero.name, { waitUntil: 'networkidle2' });
    //       await page.screenshot({path: './afk/'+hero.name+1+'.png'});
    //   });
    //   let heroes = await page.$('td.ninja_column_0.ninja_clmn_nm_hero.footable-first-visible');
    //   console.log(heroes.html());
    //   for (let index = 0; index < heroes.length; index++) {
    //       console.log(heroes[i]);
    //       await page.screenshot({path: './afk/example'+index+'.png'});
    //   }
    // --- //
    // console.log("https://www.google.com/" + imageHref);
    // var viewSource = await page.goto("https://www.google.com/" + imageHref);
    // fs.writeFile(".googles-20th-birthday-us-5142672481189888-s.png", await viewSource.buffer(), function (err) {
    // if (err) {
    //     return console.log(err);
    // }

    console.log("The file was saved!");
    
    await browser.close();
})();