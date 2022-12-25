import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

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
			children: [
				{
					type: 'heading',
					depth: 1,
					children: [
						{
							type: 'text',
							value: 'Hello',
						},
					],
				},
			],
		});
	});

	it('should jsxs generator work properly', async () => {
		expect(await evalJsx('2.tsx')).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'heading',
					depth: 1,
					children: [
						{
							type: 'text',
							value: 'Hello',
						},
					],
				},
				{
					type: 'heading',
					depth: 1,
					children: [
						{
							type: 'text',
							value: 'Bye!',
						},
					],
				},
			],
		});
	});

	it('should handle nullish, falsy and non-string values properly', async () => {
		expect(await evalJsx('3.tsx')).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'text',
					value: 'Hello',
				},
				{
					type: 'text',
					value: '15',
				},
				{
					type: 'text',
					value: '0',
				},
				{
					type: 'text',
					value: '',
				},
			],
		});
	});

	it('should handle arrays properly', async () => {
		expect(await evalJsx('4.tsx')).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'paragraph',
					children: [
						{
							type: 'text',
							value: '1',
						},
					],
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'text',
							value: '2',
						},
					],
				},
				{
					type: 'paragraph',
					children: [
						{
							type: 'text',
							value: '3',
						},
					],
				},
			],
		});
	});

	it('should handle components properly', async () => {
		expect(await evalJsx('5.tsx')).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'paragraph',
					children: [
						{
							type: 'text',
							value: 'Hello, ',
						},
						{
							type: 'text',
							value: 'world',
						},
						{
							type: 'text',
							value: '!',
						},
					],
				},
			],
		});
	});

	it('should work with fragments', async () => {
		expect(await evalJsx('6.tsx')).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'text',
					value: 'Some text',
				},
			],
		});
	});
});
