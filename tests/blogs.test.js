const Page = require('./helpers/page');

let page ;

beforeEach(async () => {
	
	page = await Page.build();
	await page.goto('localhost:3000');
	console.log('in');
});

afterEach(async () => {
	await page.close();
	console.log('out');
});



describe('When logged in', async () => {
	beforeEach(async () => {
		await page.login();
		await page.click('a.btn-floating');
		
	});
	
	test('can see blog create form', async () => {
		const label = await page.getContentOf('form label');

		expect(label).toEqual('Blog Title');
		console.log('label', label);
	});

	describe('And using valid input', async () => {
		beforeEach(async () => {
			await page.type('.title input', 'My Title');
			await page.type('.content input', 'My Content');
			await page.click('form button');
		});

		test('Submitting takes user', async () => {
			const text = await page.getContentOf('h5');

			expect(text).toEqual('Please confirm your entries');
			console.log('text', text);
		});
	});

	describe('And using invalid inputs', async () => {

		beforeEach(async () => {
			await page.click('form button');
		});

		test('the form show an error message', async () => {
			const titleError = await page.getContentOf('.title .red-text');
			const contentError = await page.getContentOf('.content .red-text');

			expect(titleError).toEqual('You must provide a value');
			expect(contentError).toEqual('You must provide a value');
		});
	});
});