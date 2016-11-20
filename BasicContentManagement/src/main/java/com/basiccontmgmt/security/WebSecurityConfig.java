package com.basiccontmgmt.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	public AuthenticationSuccessHandler successHandler() {
	    SimpleUrlAuthenticationSuccessHandler handler = new SimpleUrlAuthenticationSuccessHandler();
	    handler.setUseReferer(true);
	    return handler;
	}
	
    @Override
    protected void configure(HttpSecurity http) throws Exception {
    	
    	http
        .authorizeRequests()
            .antMatchers("/","/js/**","/css/**").permitAll()
            .anyRequest().authenticated()
        .and()
        .formLogin().loginPage("/login")
          .defaultSuccessUrl("/home.html")
          .failureUrl("/login.html?error=true")
          .permitAll()
        .and()
        .logout().logoutSuccessUrl("/login.html")
        .and()
    	.csrf().disable();
        
    }
    
    @Override
    public void configure(WebSecurity security){
        security.ignoring().antMatchers("/css/**","/images/**","/js/**");
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .inMemoryAuthentication()
                .withUser("user").password("password").roles("USER");
    }
    
   
}