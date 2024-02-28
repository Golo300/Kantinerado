package com.app.kantinerado;

import org.junit.jupiter.api.Test;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.Assert;

@SpringBootTest
class SmokeTest {

    @Test
    void contextLoads() {

        Assert.isTrue(true, "Smoke test faling");

    }

    @Test
    void failingTest() {

        Assert.isTrue(false, "Smoke test 2 faling");

    }

}