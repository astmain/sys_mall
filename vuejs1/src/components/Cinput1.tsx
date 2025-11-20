import { defineComponent, ref, watch, toRefs } from "vue"
class Props {
  type?: string
  placeholder?: string
  value?: string | number
  prefix?: { name: string; click?: () => void }
  suffix?: { name: string; click?: () => void }
  css?: any
  disabled?: boolean
}

function func(props: Props, { emit }: any) {
  const { type, placeholder, value, prefix, suffix, css, disabled } = toRefs(props)
  console.log("111---css", css)

  const isFocused = ref(false)
  let clazz = {
    parent: `flex items-center w-250px h-32px border-solid border-1 border-gray-300 rounded-md`,
    prefix: `h-full px-2  text-base  flex items-center border-1 border-r-solid border-gray-300 whitespace-nowrap `,
    input: ` w-full px-2 border-none outline-none `,
    disabled: disabled?.value ? `  cursor-not-allowed` : "", // 添加禁用样式
  }

  // 监听外部value变化，同步到内部状态
  const input_value = ref(value?.value || "")
  watch(
    () => value?.value,
    (newValue) => {
      input_value.value = newValue || ""
    },
    { immediate: true }
  )

  // 输入框的事件
  const onFocus = () => (isFocused.value = true)
  const onBlur = () => (isFocused.value = false)
  const onInput = (event: any) => {
    console.log("onInput", event.target.value)
    input_value.value = event.target.value
    emit("update:value", input_value.value)
  }

  return () => (
    <div class={clazz.parent + clazz.disabled} style={{ borderColor: isFocused.value ? "#409eff" : "", ...css?.value }}>
      {prefix?.value && (
        <div class={clazz.prefix} onClick={() => prefix?.value?.click?.()}>
          {prefix.value.name}
        </div>
      )}

      <input
        class={clazz.input + clazz.disabled}
        type={type?.value || "text"}
        placeholder={placeholder?.value || "请输入内容"}
        value={input_value.value}
        onInput={onInput}
        onFocus={onFocus}
        onBlur={onBlur}
        // 禁用
        disabled={disabled?.value || false}
      />
    </div>
  )
}

export const Cinput1 = defineComponent(func, {
  props: {
    type: String,
    placeholder: String,
    value: [String, Number],
    prefix: Object,
    suffix: Object,
    css: Object,
    disabled: Boolean,
  },
  emits: ["update:value"],
})
