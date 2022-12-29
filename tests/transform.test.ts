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

	it('should render tables', async () => {
		expect(await evalJsx('7.tsx')).toStrictEqual({
			type: 'root',
			children: [
				{
					type: 'table',
					children: [
						{
							type: 'tableRow',
							children: [
								{
									type: 'tableCell',
									children: [
										{
											type: 'text',
											value: 'Hello',
										},
									],
								},
								{
									type: 'tableCell',
									children: [
										{
											type: 'text',
											value: 'World',
										},
									],
								},
							],
						},
						{
							type: 'tableRow',
							children: [
								{
									type: 'tableCell',
									children: [
										{
											type: 'text',
											value: '123',
										},
									],
								},
								{
									type: 'tableCell',
									children: [
										{
											type: 'text',
											value: '321',
										},
									],
								},
							],
						},
					],
				},
			],
		});
	});

	it('should render code', async () => {
		expect(await evalJsx('8.tsx')).toStrictEqual({
			type: 'code',
			lang: 'js',
			value: 'const hello = 1 + 2; const bye = [1,2,3,4,5];',
		});
	});

	it('should render multiple code fragments', async () => {
		expect(await evalJsx('9.tsx')).toStrictEqual({
			type: 'code',
			value: "const hello = 10;hello world\n    that's multiline stuffbye",
		});
	});

	it('should render inlineCode', async () => {
		expect(await evalJsx('10.tsx')).toStrictEqual({
			type: 'inlineCode',
			value: 'hello',
		});
	});

	it('should render link', async () => {
		expect(await evalJsx('11.tsx')).toStrictEqual({
			type: 'link',
			url: 'hello-world',
			children: [
				{
					type: 'text',
					value: 'aaaa',
				},
			],
		});
	});
});
