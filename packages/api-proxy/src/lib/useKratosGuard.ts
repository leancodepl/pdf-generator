import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

export const UseKratosGuard = () => UseGuards(AuthGuard("kratos"))
