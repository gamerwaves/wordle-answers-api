export async function GET({ url }) {
	let requestedDate = url.searchParams.get('date');
	if (!requestedDate) {
		const match = url.search.substring(1).match(/^\d{4}-\d{2}-\d{2}$/);
		if (match) requestedDate = match[0];
	}

	let targetDate;

	if (requestedDate && /^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
		targetDate = requestedDate;
	} else {
		targetDate = new Intl.DateTimeFormat('en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).format(new Date());
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
