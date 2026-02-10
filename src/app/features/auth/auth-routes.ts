import { Route } from "@angular/router";
import { Registre } from "./registre/registre";
import { Login } from "./login/login";


export const authRoutes : Route[] = [

    {
        path:'register',
        component:Registre
    },
    {
        path:'login',
        component:Login
    }

]