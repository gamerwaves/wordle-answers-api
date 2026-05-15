<script>
	import { onMount } from 'svelte';

	let state = $state({
		word: '-----',
		puzzle: '',
		error: ''
	});

	async function loadWordle() {
		try {
			const tzOffset = new Date().getTimezoneOffset();
			const response = await fetch(`/api?tzOffset=${tzOffset}&t=${Date.now()}`, {
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
				word: data.solution.toUpperCase(),
				puzzle: `Puzzle #${data.id || '???'}`,
				error: ''
			};
		} catch (e) {
			state = {
				word: '-----',
				puzzle: '',
				error: `Could not load Wordle`
			};
		}
	}

	onMount(loadWordle);
</script>

<div class="dashboard">
	<h1>Today's Wordle</h1>

	{#if state.error}
		<div class="error">{state.error}</div>
	{:else}
		<div class="word">{state.word}</div>
		<div class="puzzle">{state.puzzle}</div>
	{/if}

	<button on:click={loadWordle}>Refresh</button>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: Arial, sans-serif;
		background: #121213;
		color: white;
	}

	.dashboard {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.word {
		font-size: 4rem;
		letter-spacing: 0.5rem;
		color: #6aaa64;
		font-weight: bold;
	}

	button {
		background: #6aaa64;
		border: none;
		padding: 0.8rem 1.5rem;
		color: white;
		border-radius: 8px;
		cursor: pointer;
	}

	.error {
		color: #ff6b6b;
	}
</style>
