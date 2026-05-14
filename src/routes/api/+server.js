export async function GET({ url }) {
	const requestedDate = url.searchParams.get('date');
	let targetDate;

	if (requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
		targetDate = requestedDate;
	} else {
		const now = new Date();
		const offset = now.getTimezoneOffset() * 60000;
		targetDate = new Date(now.getTime() - offset).toISOString().split('T')[0];
	}

	const response = await fetch(`https://www.nytimes.com/svc/wordle/v2/${targetDate}.json`);

	if (!response.ok) {
		return new Response(JSON.stringify({ error: 'Failed to fetch Wordle' }), { status: 500 });
	}

	const data = await response.json();

	const { days_since_launch, id, ...rest } = data;
	const finalData = {
		id: days_since_launch,
		...rest
	};

	return new Response(JSON.stringify(finalData), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
			Pragma: 'no-cache',
			Expires: '0'
		}
	});
}
