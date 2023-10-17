export type BillsHeaderProps = {
  title: string
  icon: string
  price: string
}

export type BillsListProps = {
  department: string
  status: string
  date: string
} & BillsHeaderProps
