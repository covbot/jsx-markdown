import { transform } from 'esbuild';
import fs from 'node:fs/promises';
import { URL } from 'node:url';

const encodeESM = (code: string) => `data:text/javascript,${encodeURIComponent(code)}`;

const jsxRuntimeUrl = new URL('../dist/jsx-runtime.esm.js', import.meta.url);
const jsxRuntime = await fs.readFile(jsxRuntimeUrl);

const evalJsx = async (source: string) => {
	const { code: transformedSource } = await transform(source, {
		jsxImportSource: '#root',
		jsx: 'automatic',
		loader: 'jsx',
	});

	const inlinedDependencies = transformedSource.replace('#root/jsx-runtime', encodeESM(jsxRuntime.toString()));

	const module = await import(encodeESM(inlinedDependencies));

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
