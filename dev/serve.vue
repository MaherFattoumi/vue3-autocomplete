<template>
	<section id="app" class="container">
		<form>
			<div class="row">
				<div class="column column-20"></div>
				<div class="column column-60">
					<autocomplete
						ref="refTest"
						defaultItem=""
						:items="list"
						placeholder="nom.prenom"
						@selectItem="selectItem"
						@onInput="onInput"
						@onBlur="onBlur"
						:minInputLength="1"
						:selectOnTab="true"
					/>
				</div>
				<div class="column column-20"></div>
			</div>
		</form>
	</section>
</template>

<script>
	import { defineComponent } from 'vue';
	import Autocomplete from '@/autocomplete.vue';

	export default defineComponent({
		name: 'ServeDev',
		components: {
			Autocomplete,
		},
		created() {
			this.listFiltered = this.list;
		},
		data() {
			return {
				listLazy: [],
				list: [
					'maher.fattoumi1',
					'maher.fattoumi2',
					'maher.fattoumi3',
					'maher.fattoumi4',
					'maher.fattoumi5',
					'maher.fattoumi6',
					'maher.fattoumi7',
					'maher.fattoumi8',
					'maher.fattoumi9',
					'maher.fattoumi10',
					'maher.fattoumi11',
					'maher.fattoumi12',
					'maher.fattoumi13',
					'maher.fattoumi14',
					'maher.fattoumi15',
					'maher.fattoumi16',
					'maher.fattoumi17',
					'maher.fattoumi18',
					'maher.fattoumi19',
					'maher.fattoumi20',
					'maher.fattoumi21',
					'maher.fattoumi22',
					'maher.fattoumi23',
					'maher.fattoumi24',
					'maher.fattoumi25',
					'maher.fattoumi26',
					'maher.fattoumi27',
				],
				listFiltered: [],
				data: {
					input: '',
					selection: null,
				},
			};
		},
		methods: {
			test() {
				console.log(this.$refs.refTest);
			},
			selectItem(item) {
				this.data.selection = item;
				console.log("Item selected :", item)
			},
			onInput(event) {
				this.data.selection = null;
				this.data.input = event.input;
				this.listFiltered = event.items;

				if (event.input.length > 3) {
					setTimeout(() => (this.listLazy = this.list));
				} else {
					this.listLazy = [];
				}
			},
			onBlur(event) {
				this.data.input = event.input;
				this.listFiltered = event.items;
			},
		},
	});
</script>

<style>
	@import '//fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic';
	@import '//cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.css';
	@import 'https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css';
	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>
