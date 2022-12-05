// Checking how jsx transform handles arrays

const arr = [1, 2, 3];

export default (
	<root>
		{arr.map((item) => (
			<p>{item}</p>
		))}
	</root>
);
