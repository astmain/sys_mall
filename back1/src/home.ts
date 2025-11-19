import { Controller, Get, Module } from '@nestjs/common'

@Controller()
export class home {
  @Get()
  getHello(): string {
    return '1111'
  }
}



@Module({
  controllers: [home],
  providers: [],
})
export class home_module { }