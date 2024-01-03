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
        :class="{ 'xxx-autocomplete-list-item-active': currentSelectionIndex === index }"
        v-for="(item, index) in filteredItems"
        :key="index"
        @mousedown.prevent
        @click="selectItem(item)"
        @mouseenter="currentSelectionIndex = index"
      >
        <span class="xxx-autocomplete-list-item-text" :data-text="itemProjection(item)" v-if="$slots['list-item-text']">
          <slot name="list-item-text" :item="item" :itemProjection="itemProjection" :boldMatchText="boldMatchText"></slot>
        </span>
        <span class="xxx-autocomplete-list-item-text" :data-text="itemProjection(item)" v-html="boldMatchText(itemProjection(item))" v-else></span>
      </div>
      <div class="xxx-autocomplete-list-footer" v-if="$slots['list-footer']"><slot name="list-footer"></slot></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';

export default {
  name: 'Autocomplete',
  emits: ['onInput', 'onFocus', 'onBlur', 'selectItem'],
  props: {
    // ... (your existing props)
  },
  setup(props) {
    const inputId = ref(props.id || `simple_autocomplete_${(Math.random() * 1000).toFixed()}`);
    const input = ref('');
    const isInputFocused = ref(false);
    const currentSelectionIndex = ref(0);

    // ... (your existing setup code)

    return {
      inputId,
      input,
      isInputFocused,
      currentSelectionIndex,
      // ... (other variables/functions you return from setup)
    };
  },
  methods: {
    // ... (your existing methods)
  },
  computed: {
    // ... (your existing computed properties)
  },
};
</script>

<style scoped>
  /* ... (your existing styles) */
</style>


In this refactoring, the setup function is used instead of the data and mounted options, and ref is used to create reactive references to the state variables. The methods and computed sections remain the same, and the template remains unchanged. The component should function similarly to your Vue 2 version but is adapted to Vue 3's Composition API.
