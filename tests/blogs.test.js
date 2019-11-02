const Page = require('./helpers/page');

let page ;

beforeEach(async () => {
	
	page = await Page.build();
	await page.goto('http://localhost:3000');
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
			console.log('Cliiiick1');
			await page.type('.content input', 'My Content');
			console.log('Cliiiick2');
			await page.click('form button');
		});

		test('Submitting takes user to review screen', async () => {
			const text = await page.getContentOf('h5');

			expect(text).toEqual('Please confirm your entries');
			console.log('text', text);
		});

		test('Submitting then saving adds blog to index page', async () => {
			await page.click('button.green');
			await page.waitFor('.card');

			const title = await page.getContentOf('.card-title');
			const content = await page.getContentOf('p');

			expect(title).toEqual('My Title');
			expect(content).toEqual('My Content');
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

describe('User is not logged in', async () => {
	const actions = [
		{
			method:'get',
			path: '/api/blogs'
		},
		{
			method: 'post',
			path: '/api/blogs',
			data: {
				title: 'T',
				constent: 'C'
			}
		}
	];

	test('Blog related actions are prohibited', async () => {
		const results = await page.execRequests(actions);
		console.log(results);
		for (let result of results) {
			expect(result).toEqual({ error: 'You must log in!'});

		}
	})
});