import { defineComponent } from "vue"

export const Ccard1 = defineComponent({
  name: "Ccard1",
  props: {
    head: {
      type: [String, Function],
      default: "Hello World"
    },
  },
  setup(props, { emit }) {
    return () => (
      <div class="border border-gray-200 rounded-lg p-4">
        <div class="mb-4">
          {typeof props.head === 'function' ? props.head() : <div>{props.head}</div>}
        </div>
        <div class="content">
          {/* 卡片内容区域 */}
        </div>
      </div>
    )
  },
})