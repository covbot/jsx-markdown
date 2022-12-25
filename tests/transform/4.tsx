// Checking how jsx transform handles arrays

const array = [1, 2, 3];

export default (
	<root>
		{array.map((item) => (
			<p>{item}</p>
		))}
	</root>
);
