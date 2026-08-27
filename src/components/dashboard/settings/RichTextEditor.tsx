import { useMemo, useRef } from 'react'
import JoditEditor from 'jodit-react'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
}

export default function RichTextEditor({ value, onChange, placeholder, height = 360 }: Props) {
  const editor = useRef(null)

  const config = useMemo(
    () => {
      const buttons = ['paragraph', 'bold', 'italic', 'underline', 'ul', 'ol', 'link', 'fontsize']
      return {
        readonly: false,
        height,
        theme: 'dark',
        placeholder: placeholder ?? 'Start typing...',
        toolbarButtonSize: 'middle' as const,
        toolbarAdaptive: false,
        buttons,
        buttonsMD: buttons,
        buttonsSM: buttons,
        buttonsXS: buttons,
        statusbar: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        showTooltip: false,
        showTooltipDelay: 0,
        addNewLine: false,
        showPlaceholder: true,
        hidePoweredByJodit: true,
        disablePlugins: ['add-new-line', 'powered-by-jodit', 'stat', 'about', 'mobile'],
      }
    },
    [height, placeholder],
  )

  return (
    <div className="jodit-dark-wrapper overflow-hidden rounded-xl border border-surface-border">
      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  )
}
