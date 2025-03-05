export interface InterfaceMenu {
  menuName: string;
  imgPath: string;
  menuSelected?: boolean;
  navigateRouter: string;
  subMenu?: InterfaceMenu[];
}
