const Page = require ('./helpers/page')

let page;

beforeEach(async () => {//exectede before each test in this file
	page = await Page.build();
	await page.goto('http://localhost:3000');
});

afterEach(async () => {
	if(page){
		await page.close();
	}
})

test('header has the correct text', async () => {
	const text = await page.getContentOf('a.brand-logo');
	//with puppeteer the function will send as a String then exec into chromuim
	//"$" in the function is not special, just name
	//The real idea here is that all the code that we run is being serialized into text sent over the chromium
	//executed the result gets serialized back into text and then sent back over to our no just run time.
	
	expect(text).toEqual('Blogster');
});

test('clicking login starts oauth flow', async () => {
	await page.click('.right a');

	const url = await page.url();

	expect(url).toMatch(/accounts\.google\.com/)
});

test('When signed in, shows logout button', async () => {
	//const id = '5db4a8935f22b049f4dc6ff0';
	await page.login();
	const text = await page.getContentOf('a[href="/auth/logout"]');
	console.log('text : ', text);
	expect(text).toEqual('Logout');
});