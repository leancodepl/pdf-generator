import { UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"

export const UseJwtGuard = () => UseGuards(AuthGuard("jwt"))
