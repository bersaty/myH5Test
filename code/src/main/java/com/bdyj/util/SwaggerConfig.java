package com.bdyj.util;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfig {

    @Component
    @Configuration
    @EnableSwagger2
    @EnableWebMvc
    @ComponentScan("com.bdyj.controller")
    public class Swagger2Config {
        @Bean
        public Docket createAPI() {
            return new Docket(DocumentationType.SWAGGER_2).forCodeGeneration(true).select().apis(RequestHandlerSelectors.any())
                    //过滤生成链接
                    .paths(PathSelectors.any()).build().apiInfo(apiInfo());
        }

        private ApiInfo apiInfo() {

            Contact contact=new Contact("Makise","https://github.com/Okabe-Kurisu","844082183@qq.com");
            ApiInfo apiInfo = new ApiInfoBuilder().license("Apache License Version 2.0").title("佛学app api").description("apiapiapi").contact(contact).version("1.0").build();

            return apiInfo;
        }

    }

}
