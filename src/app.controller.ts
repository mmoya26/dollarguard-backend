import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from "@nestjs/common";


@Controller()
export class AppController {
    @Get()
    getHello() {
        return 'Hello World!';
    } 
}