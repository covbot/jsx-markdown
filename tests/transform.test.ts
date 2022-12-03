import { transform } from 'esbuild';

const encodeESM = (code: string) => `data:text/javascript,${encodeURIComponent(code)}`;

const evalJsx = async (source: string) => {
	const { code: transformedSource } = await transform(source, {
		jsxImportSource: '@covbot/jsx-markdown',
		jsx: 'automatic',
		loader: 'jsx',
	});

	const module = await import(encodeESM(transformedSource));

	return module.default;
};

describe('transform', () => {
	it('should provide esbuild-compatible jsx transform', async () => {
		expect(await evalJsx('const output = <root><h1>Hello</h1></root>;export default output;')).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'heading',
					children: ['Hello'],
					depth: 1,
				},
			],
		});
	});

	it('should jsxs generator work properly', async () => {
		expect(
			await evalJsx('const output = <root><h1>Hello</h1><h1>Bye!</h1></root>;export default output;'),
		).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'heading',
					depth: 1,
					children: ['Hello'],
				},
				{
					type: 'heading',
					depth: 1,
					children: ['Bye!'],
				},
			],
		});
	});

	it('should transform headings correctly', async () => {
		expect(
			await evalJsx(`const output = (<root>
				<h1>one</h1>
				<h2>two</h2>
				<h3>three</h3>
				<h4>four</h4>
				<h5>five</h5>
				<h6>six</h6>
			</root>);
			export default output;`),
		).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'heading',
					depth: 1,
					children: ['one'],
				},
				{
					type: 'heading',
					depth: 2,
					children: ['two'],
				},
				{
					type: 'heading',
					depth: 3,
					children: ['three'],
				},
				{
					type: 'heading',
					depth: 4,
					children: ['four'],
				},
				{
					type: 'heading',
					depth: 5,
					children: ['five'],
				},
				{
					type: 'heading',
					depth: 6,
					children: ['six'],
				},
			],
		});
	});

	it('should transform paragraphs', () => {});
});
