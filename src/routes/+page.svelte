<script>
	import { onMount } from 'svelte';

	let state = $state({
		word: '-----',
		puzzle: '',
		error: '',
		date: ''
	});

	async function loadWordle(targetDate = null) {
		try {
			if (!targetDate && !state.date) {
				const localDate = new Intl.DateTimeFormat('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit'
				}).format(new Date());
				state.date = localDate;
			} else if (targetDate) {
				state.date = targetDate;
			}

			const url = `/api?date=${state.date}&t=${Date.now()}`;
			const response = await fetch(url, {
				cache: 'no-store'
			});
			const data = await response.json();

			if (data.error) {
				state = { ...state, error: data.error, word: '-----', puzzle: '' };
				return;
			}

			if (!data.solution) {
				state = { ...state, error: 'Invalid data format from API', word: '-----', puzzle: '' };
				return;
			}

			state = {
				...state,
				word: data.solution.toUpperCase(),
				puzzle: `Puzzle #${data.id || '???'}`,
				error: ''
			};
		} catch (e) {
			state = {
				...state,
				word: '-----',
				puzzle: '',
				error: `Could not load Wordle`
			};
		}
	}

	function changeDate(days) {
		const d = new Date(state.date + 'T12:00:00');
		d.setDate(d.getDate() + days);
		loadWordle(d.toISOString().split('T')[0]);
	}

	function handleCalendarChange(e) {
		loadWordle(e.target.value);
	}

	onMount(() => loadWordle());
</script>

<div class="dashboard">
	<div class="nav-controls">
		<button onclick={() => changeDate(-1)} aria-label="Previous Day">←</button>
		<input type="date" value={state.date} onchange={handleCalendarChange} />
		<button onclick={() => changeDate(1)} aria-label="Next Day">→</button>
	</div>

	{#if state.error}
		<div class="error">{state.error}</div>
	{:else}
		<div class="word">{state.word}</div>
		<div class="puzzle">{state.puzzle}</div>
	{/if}

	<button class="refresh" onclick={() => loadWordle()}>Refresh</button>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
		background: #121213;
		color: white;
	}

	.dashboard {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}

	.nav-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	input[type='date'] {
		background: #272729;
		border: 1px solid #3a3a3c;
		color: white;
		padding: 0.5rem;
		border-radius: 8px;
		font-family: inherit;
		color-scheme: dark;
		accent-color: #6aaa64;
	}

	input[type='date']::-webkit-calendar-picker-indicator {
		filter: invert(58%) sepia(13%) saturate(1131%) hue-rotate(69deg) brightness(97%) contrast(85%); /* This approximates #6aaa64 */
		cursor: pointer;
	}

	.word {
		font-size: 4rem;
		letter-spacing: 0.5rem;
		color: #6aaa64;
		font-weight: bold;
	}

	.puzzle {
		font-size: 1.2rem;
		color: #818384;
	}

	button {
		background: #6aaa64;
		border: none;
		padding: 0.8rem 1.2rem;
		color: white;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1.2rem;
		transition: background 0.2s;
		font-family: inherit;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button:hover {
		background: #5f9955;
	}

	button.refresh {
		font-size: 1rem;
	}

	.error {
		color: #ff6b6b;
	}
</style>
