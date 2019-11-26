const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.afkarena.net/heroes', { waitUntil: 'networkidle2' });
    let data = await page.evaluate(() => {
        let heroes = [];
        let data = document.querySelectorAll('td.ninja_column_0.ninja_clmn_nm_hero.footable-first-visible a');
        data = Array.from(data);
        data.forEach( (hero) => {
            let h_name = hero.innerText;
            let h_link = hero.getAttribute('href');
            if (h_name !== '') {
                heroes.push({name: h_name, link: h_link});
            }
        });
        return heroes;
    });
    console.log(data);
    await page.goto('https://www.afkarena.net/'+data[0].name, { waitUntil: 'networkidle2' });
    await page.screenshot({path: './afk/'+data[0].name+1+'.png'});

    for (let hero of data) {
        await page.goto(hero.link)
        await page.setViewport({ width: 1920, height: 1070 });
        await page.screenshot({path: './afk/'+hero.name+'.png'});
    };
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