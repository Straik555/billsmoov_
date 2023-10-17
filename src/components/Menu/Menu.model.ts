export type Page = {
  title: string
  path: symbol
  icon: string
  activeIcon: string
}

export type MenuProps = {
  onOpen: () => void
}
