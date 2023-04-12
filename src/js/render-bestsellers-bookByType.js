// Iskra Matjuha
import { BookAPI } from './api-service';
const categoryBooksEl = document.querySelector('.book-category__list');
const bookApi = new BookAPI();
//запрос книг по выбранной категории - считываем категорию со списка категорий - и нужно прорисовать книги из нее
export async function handleRenderCategoryItem(category) {
  console.log(category);

  const response = await bookApi.getBooksByCategories(category);
  const categoryBooks = response.data;
  console.log(response);
  console.log(categoryBooks);
  categoryBooksEl.innerHTML = `
      ${categoryBooks
        .map(
          el => `<li class="category-books" > <a href= "" class ="book"> <img src = ${el.book_image} data-id= ${el._id}> </a>
   </li>`
        )
        .join('')}
      `;
}