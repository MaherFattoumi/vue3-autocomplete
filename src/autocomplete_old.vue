<template>
	<div :id="wrapperId" class="xxx-autocomplete">
		<input
			ref="inputRef"
			:id="inputId"
			class="xxx-autocomplete-input"
			type="text"
			:placeholder="placeholder"
			v-model="input"
			@input="onInput"
			@focus="onFocus"
			@blur="onBlur"
			@keydown.down.prevent="onArrowDown"
			@keydown.up.prevent="onArrowUp"
			@keydown.enter.prevent="selectCurrentSelection"
			@keydown.tab.prevent="selectCurrentSelectionTab"
			autocomplete="off"
			v-bind="$attrs"
		/>
		<div v-if="isListVisible" class="xxx-autocomplete-list">
			<div class="xxx-autocomplete-list-header" v-if="$slots['list-header']"><slot name="list-header"></slot></div>
			<div
				class="xxx-autocomplete-list-item"
				:class="{ 'xxx-autocomplete-list-item-active': currentSelectionIndex == index }"
				v-for="(item, index) in filteredItems"
				:key="index"
				@mousedown.prevent
				@click="selectItem(item)"
				@mouseenter="currentSelectionIndex = index"
			>
				<span class="xxx-autocomplete-list-item-text" :data-text="itemProjection(item)" v-if="$slots['list-item-text']"
					><slot name="list-item-text" :item="item" :itemProjection="itemProjection" :boldMatchText="boldMatchText"></slot
				></span>
				<span class="xxx-autocomplete-list-item-text" :data-text="itemProjection(item)" v-html="boldMatchText(itemProjection(item))" v-else></span>
			</div>
			<div class="xxx-autocomplete-list-footer" v-if="$slots['list-footer']"><slot name="list-footer"></slot></div>
		</div>
	</div>
</template>

<script>
	import { defineComponent } from 'vue';

	export default defineComponent({
		name: 'Autocomplete',
		emits: ['onInput', 'onFocus', 'onBlur', 'selectItem'],
		inheritAttrs: false,
		props: {
			id: {
				type: String,
			},
			placeholder: {
				type: String,
				default: '',
			},
			items: {
				type: Array,
				required: true,
			},
			defaultItem: {
				default: null,
			},
			itemProjection: {
				type: Function,
				default(item) {
					return item;
				},
			},
			minInputLength: {
				type: Number,
				default: 2,
				validator: (prop) => {
					return prop >= 0;
				},
			},
			minItemLength: {
				type: Number,
				default: 0,
				validator: (prop) => {
					return prop >= 0;
				},
			},
			selectOnTab: {
				type: Boolean,
				default: true,
			},
		},
		mounted() {
			if (this.defaultItem !== undefined && this.defaultItem !== null) {
				this.selectItem(this.defaultItem);
			}
		},
		data() {
			return {
				inputId: this.id || `simple_autocomplete_${(Math.random() * 1000).toFixed()}`,
				input: '',
				isInputFocused: false,
				currentSelectionIndex: 0,
			};
		},
		methods: {
			onInput() {
				if (this.isListVisible && this.currentSelectionIndex >= this.filteredItems.length) {
					this.currentSelectionIndex = (this.filteredItems.length || 1) - 1;
				}
				this.$emit('onInput', { input: this.input, items: this.filteredItems });
			},
			onFocus() {
				this.isInputFocused = true;
				this.$emit('onFocus', { input: this.input, items: this.filteredItems });
			},
			onBlur() {
				this.isInputFocused = false;
				this.$emit('onBlur', { input: this.input, items: this.filteredItems });
			},
			onArrowDown($event) {
				if (this.isListVisible && this.currentSelectionIndex < this.filteredItems.length - 1) {
					this.currentSelectionIndex++;
				}
				this.scrollSelectionIntoView();
			},
			onArrowUp($event) {
				if (this.isListVisible && this.currentSelectionIndex > 0) {
					this.currentSelectionIndex--;
				}
				this.scrollSelectionIntoView();
			},
			scrollSelectionIntoView() {
				setTimeout(() => {
					const list_node = document.querySelector(`#${this.wrapperId} .xxx-autocomplete-list`);
					const active_node = document.querySelector(`#${this.wrapperId} .xxx-autocomplete-list-item.xxx-autocomplete-list-item-active`);

					if (!(active_node.offsetTop >= list_node.scrollTop && active_node.offsetTop + active_node.offsetHeight < list_node.scrollTop + list_node.offsetHeight)) {
						let scroll_to = 0;
						if (active_node.offsetTop > list_node.scrollTop) {
							scroll_to = active_node.offsetTop + active_node.offsetHeight - list_node.offsetHeight;
						} else if (active_node.offsetTop < list_node.scrollTop) {
							scroll_to = active_node.offsetTop;
						}

						list_node.scrollTo(0, scroll_to);
					}
				});
			},
			selectCurrentSelection() {
				if (this.currentSelection) {
					this.selectItem(this.currentSelection);
				}
			},
			selectCurrentSelectionTab() {
				if (this.selectOnTab) {
					this.selectCurrentSelection();
				} else {
					this.$refs.inputRef.blur();
				}
			},
			selectItem(item) {
				this.input = this.itemProjection(item);
				this.currentSelectionIndex = 0;
				this.$refs.inputRef.blur();
				this.$emit('selectItem', item);
			},
			escapeRegExp(string) {
				return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			},
			boldMatchText(text) {
				const regexp = new RegExp(`(${this.escapeRegExp(this.input)})`, 'ig');
				return text.replace(regexp, '<strong>$1</strong>');
			},
			clearInput() {
				this.input = '';
			},
			getInput() {
				return this.$refs.inputRef;
			},
			focusInput() {
				this.$refs.inputRef.focus();
				this.onFocus();
			},
			blurInput() {
				this.$refs.inputRef.blur();
				this.onBlur();
			},
		},
		computed: {
			wrapperId() {
				return `${this.inputId}_wrapper`;
			},
			filteredItems() {
				const regexp = new RegExp(this.escapeRegExp(this.input), 'i');
				return this.items.filter((item) => this.itemProjection(item).match(regexp));
			},
			isListVisible() {
				return this.isInputFocused && this.input.length >= this.minInputLength && this.filteredItems.length > this.minItemLength;
			},
			currentSelection() {
				return this.isListVisible && this.currentSelectionIndex < this.filteredItems.length ? this.filteredItems[this.currentSelectionIndex] : undefined;
			},
		},
	});
</script>

<style scoped>
	.xxx-autocomplete {
		position: relative;
		width: 100%;
	}
	.xxx-autocomplete > input {
		margin-bottom: 0;
	}
	.xxx-autocomplete .xxx-autocomplete-list {
		position: absolute;
		width: 100%;
		border: none;
		max-height: 400px;
		overflow-y: auto;
		border-bottom: 0.1rem solid #d1d1d1;
		z-index: 9;
	}
	.xxx-autocomplete .xxx-autocomplete-list .xxx-autocomplete-list-header {
		background-color: #fafafa;
		padding: 0.6rem 1rem;
		border-bottom: 0.1rem solid #d1d1d1;
		border-left: 0.1rem solid #d1d1d1;
		border-right: 0.1rem solid #d1d1d1;
	}
	.xxx-autocomplete .xxx-autocomplete-list .xxx-autocomplete-list-footer {
		background-color: #fafafa;
		padding: 0.6rem 1rem;
		border-left: 0.1rem solid #d1d1d1;
		border-right: 0.1rem solid #d1d1d1;
	}
	.xxx-autocomplete .xxx-autocomplete-list .xxx-autocomplete-list-item {
		cursor: pointer;
		background-color: #fafafa;
		padding: 0.6rem 1rem;
		border-bottom: 0.1rem solid #d1d1d1;
		border-left: 0.1rem solid #d1d1d1;
		border-right: 0.1rem solid #d1d1d1;
	}

	.xxx-autocomplete .xxx-autocomplete-list .xxx-autocomplete-list-item:last-child {
		border-bottom: none;
	}

	.xxx-autocomplete .xxx-autocomplete-list .xxx-autocomplete-list-item.xxx-autocomplete-list-item-active {
		background-color: #e1e1e1;
	}
</style>
