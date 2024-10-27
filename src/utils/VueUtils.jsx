import {NIcon, NSwitch, NTooltip} from 'naive-ui'
import {HelpCircleOutline} from '@vicons/ionicons5'

export function createTitleWithTooltip(titleText, tooltipText) {
  return <NTooltip trigger="hover">
    {{
      default: () => tooltipText,
      trigger: () => (
          <div style="display: flex; align-items: center;">
            <span>{titleText}</span>
            <NIcon style="margin-left: 4px; color: #909399;">
              <HelpCircleOutline />
            </NIcon>
          </div>
      ),
    }}
  </NTooltip>
}

export function createSwitchForTable(row, keyName) {
  return <NSwitch
      value={row[keyName]}
      onUpdate:value={(newValue) => row[keyName] = newValue}
  >
    {{
      checked: () => '是',
      unchecked: () => '否',
    }}
  </NSwitch>
}
