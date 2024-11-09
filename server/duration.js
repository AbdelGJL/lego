function Duration(time) {
    const today = new Date();

    let Difference_In_Time = Math.abs(today.getTime() - time * 1000);
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

    if (Difference_In_Days <= 1) {
        let Difference_In_Hours = Math.round(Difference_In_Time / (1000 * 3600));
        return Difference_In_Hours + " hours ago";
    }
    else if (Difference_In_Days <= 31) {
        return Difference_In_Days + " days ago";
    }
    else {
        return parseInt(Difference_In_Days/30) + " months ago (" + Difference_In_Days + " days)";
    }
}

console.log(Duration(1687776784)); // 18 days 