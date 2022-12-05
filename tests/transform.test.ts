import { transform } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const encodeESM = (code: string) => `data:text/javascript,${encodeURIComponent(code)}`;

const evalJsx = async (sourceFile: string) => {
	const directory = dirname(fileURLToPath(import.meta.url));

	const source = await readFile(join(directory, 'transform', sourceFile));

	const { code: transformedSource } = await transform(source, {
		jsxImportSource: '@covbot/jsx-markdown',
		jsx: 'automatic',
		loader: 'tsx',
	});

	const module = await import(encodeESM(transformedSource));

	return module.default;
};

describe('transform', () => {
	it('should provide esbuild-compatible jsx transform', async () => {
		expect(await evalJsx('1.tsx')).toStrictEqual({
			type: 'root',
			props: {
				children: [
					{
						type: 'h1',
						props: {
							children: ['Hello'],
						},
					},
				],
			},
		});
	});

	it('should jsxs generator work properly', async () => {
		expect(await evalJsx('2.tsx')).toStrictEqual({
			type: 'root',
			props: {
				children: [
					{
						type: 'h1',
						props: {
							children: ['Hello'],
						},
					},
					{
						type: 'h1',
						props: {
							children: ['Bye!'],
						},
					},
				],
			},
		});
	});

	it('should handle nullish, falsy and non-string values properly', async () => {
		expect(await evalJsx('3.tsx')).toStrictEqual({
			type: 'root',
			props: {
				children: ['Hello', 15, 0, ''],
			},
		});
	});

	it('should handle arrays properly', async () => {
		expect(await evalJsx('4.tsx')).toStrictEqual({
			type: 'root',
			props: {
				children: [
					{
						type: 'p',
						props: {
							children: [1],
						},
					},
					{
						type: 'p',
						props: {
							children: [2],
						},
					},
					{
						type: 'p',
						props: {
							children: [3],
						},
					},
				],
			},
		});
	});

	it('should handle components properly', async () => {
		expect(await evalJsx('5.tsx')).toStrictEqual({
			type: 'root',
			props: {
				children: [
					{
						props: {
							name: 'world',
						},
						type: expect.any(Function),
					},
				],
			},
		});
	});
});
