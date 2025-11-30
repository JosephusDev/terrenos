import { SidebarMobile } from "./Mobile"
import { SidebarDesktop } from "./Desktop"

export default function Sidebar(){
    return(
        <div className="flex w-full flex-col bg-muted/40">
            <SidebarDesktop/>
            <SidebarMobile/>
        </div>
    )
}