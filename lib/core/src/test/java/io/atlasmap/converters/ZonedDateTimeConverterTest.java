/*
 * Copyright (C) 2017 Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.atlasmap.converters;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.ZonedDateTime;
import java.util.Date;

import org.junit.jupiter.api.Test;

public class ZonedDateTimeConverterTest {

    private ZonedDateTimeConverter converter = new ZonedDateTimeConverter();

    @Test
    public void toDate() {
        ZonedDateTime now = ZonedDateTime.now();
        Date date = converter.toDate(now);
        assertNotNull(date);
        assertEquals(date.getTime(), now.toInstant().toEpochMilli());
    }
}
