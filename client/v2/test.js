async function onClickBestDiscount() {
    RemoveAllFilters("discount");
  
    if (isDiscountFiltered) {
      const deals = await fetchDeals(
        parseInt(selectPage.value),
        parseInt(selectShow.value)
      );
      setCurrentDeals(deals);
      isDiscountFiltered = false;
      discountButton.classList.remove("active");
      //discountButton.style.backgroundColor = "";
    } else {
      let deals_filtered = [];
  
      currentDeals.forEach((deal) => {
        if (deal.discount >= 50) {
          deals_filtered.push(deal);
        }
      });
  
      isDiscountFiltered = true;
      discountButton.classList.add("active");
      //discountButton.style.backgroundColor = "lightblue";
      currentDeals = deals_filtered;
    }
    render(currentDeals, currentPagination);
  }
  
  async function onClickMostCommented() {
    RemoveAllFilters("commented");
  
    if (isCommentedFiltered) {
      const deals = await fetchDeals(
        parseInt(selectPage.value),
        parseInt(selectShow.value)
      );
      setCurrentDeals(deals);
      isCommentedFiltered = false;
      commentedButton.classList.remove("active");
      //commentedButton.style.backgroundColor = "";
    } else {
      let deals_filtered = [];
  
      currentDeals.forEach((deal) => {
        if (deal.comments >= 15) {
          deals_filtered.push(deal);
        }
      });
  
      isCommentedFiltered = true;
      commentedButton.classList.add("active");
      //commentedButton.style.backgroundColor = "lightblue";
      currentDeals = deals_filtered;
    }
    render(currentDeals, currentPagination);
  }
  
  async function onClickHotDeals() {
    await RemoveAllFilters("hotDeal");
  
    if (isHotDealFiltered) {
      const deals = await fetchDeals(
        parseInt(selectPage.value),
        parseInt(selectShow.value)
      );
      setCurrentDeals(deals);
      isHotDealFiltered = false;
      hotDealButton.classList.remove("active");
      //hotDealButton.style.backgroundColor = "";
    } else {
      let deals_filtered = [];
  
      currentDeals.forEach((deal) => {
        if (deal.temperature >= 100) {
          deals_filtered.push(deal);
        }
      });
  
      isHotDealFiltered = true;
      hotDealButton.classList.add("active");
      //hotDealButton.style.backgroundColor = "lightblue";
      currentDeals = deals_filtered;
    }
    render(currentDeals, currentPagination);
  }
  
  async function RemoveAllFilters(filterToKeep = null) {
    const deals = await fetchDeals(
      parseInt(selectPage.value),
      parseInt(selectShow.value)
    );
    setCurrentDeals(deals);
  
    if (filterToKeep !== "discount") {
      isDiscountFiltered = false;
      discountButton.classList.remove("active");
      //discountButton.style.backgroundColor = "";
    }
  
    if (filterToKeep !== "commented") {
      isCommentedFiltered = false;
      commentedButton.classList.remove("active");
      //commentedButton.style.backgroundColor = "";
    }
  
    if (filterToKeep !== "hotDeal") {
      isHotDealFiltered = false;
      hotDealButton.classList.remove("active");
      //hotDealButton.style.backgroundColor = "";
    }
  }
  