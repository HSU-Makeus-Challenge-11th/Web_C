package com.umc.backend_spring.controller;

import com.umc.backend_spring.repository.BookRepository;
import com.umc.backend_spring.repository.RentalRepository;
import com.umc.backend_spring.service.BookService;
import com.umc.backend_spring.service.RentalService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({BookController.class, RentalController.class})
@Import({BookService.class, RentalService.class})
class BookRentalApiTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookRepository bookRepository;

    @MockitoBean
    private RentalRepository rentalRepository;

    @Test
    void categoryPathIsPassedToRepositoryAndBooksAreReturned() throws Exception {
        when(bookRepository.findByCategoryId(2L)).thenReturn(List.of(
                Map.of("book_id", 3L, "category_id", 2L, "title", "우주를 읽는 법")
        ));

        mockMvc.perform(get("/books/category/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].category_id").value(2))
                .andExpect(jsonPath("$[0].title").value("우주를 읽는 법"));

        verify(bookRepository).findByCategoryId(2L);
    }

    @Test
    void categoryWithoutBooksReturnsEmptyArray() throws Exception {
        when(bookRepository.findByCategoryId(999L)).thenReturn(List.of());

        mockMvc.perform(get("/books/category/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void nonNumericCategoryIsRejectedBeforeQuerying() throws Exception {
        mockMvc.perform(get("/books/category/invalid"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(bookRepository);
    }

    @Test
    void rentalCreationReturnsGeneratedId() throws Exception {
        when(rentalRepository.save(1L, 3L)).thenReturn(42L);

        mockMvc.perform(post("/rentals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":1,\"bookId\":3}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rentalId").value(42))
                .andExpect(jsonPath("$.message").value("도서 대여가 완료되었습니다!"));

        verify(rentalRepository).save(1L, 3L);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{}",
            "{\"userId\":1}",
            "{\"bookId\":3}",
            "{\"userId\":null,\"bookId\":3}",
            "{\"userId\":0,\"bookId\":3}",
            "{\"userId\":1,\"bookId\":-1}",
            "{\"userId\":\"invalid\",\"bookId\":3}"
    })
    void invalidRentalRequestDoesNotCreateRecord(String body) throws Exception {
        mockMvc.perform(post("/rentals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(rentalRepository);
    }

    @Test
    void unknownUserOrBookReturnsBadRequest() throws Exception {
        when(rentalRepository.save(999L, 3L))
                .thenThrow(new DataIntegrityViolationException("Foreign key constraint"));

        mockMvc.perform(post("/rentals")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"userId\":999,\"bookId\":3}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void returnUpdatesRentalFromPath() throws Exception {
        when(rentalRepository.returnRental(42L)).thenReturn(1);

        mockMvc.perform(patch("/rentals/42/return"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rentalId").value(42))
                .andExpect(jsonPath("$.message").value("도서 반납이 완료되었습니다!"));

        verify(rentalRepository).returnRental(42L);
    }

    @Test
    void unknownRentalReturnsNotFound() throws Exception {
        when(rentalRepository.returnRental(999L)).thenReturn(0);

        mockMvc.perform(patch("/rentals/999/return"))
                .andExpect(status().isNotFound());
    }

    @ParameterizedTest
    @ValueSource(strings = {"0", "-1", "invalid"})
    void invalidRentalIdIsRejectedBeforeUpdating(String rentalId) throws Exception {
        mockMvc.perform(patch("/rentals/{rentalId}/return", rentalId))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(rentalRepository);
    }
}
