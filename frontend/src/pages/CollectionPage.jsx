import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import FilterBar from "../components/Products/FilterBar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {fetchProductsByFilters} from '../redux/slice/productSlice'
const CollectionPage = () => {
  const {collection} = useParams();
  const [searchParams]=  useSearchParams(); 
  const dispatch = useDispatch();
  const {products,loading,error} = useSelector((state)=>state.products)
  const queryParams = Object.fromEntries([...searchParams])
  const sidebarRef = useRef(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  useEffect(()=>{
    dispatch(fetchProductsByFilters({collection,...queryParams}))
  },[dispatch,collection,searchParams])
  const toggleSidebar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };
  const handleClickOutside = (e) => {
    //close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSideBarOpen(false);
    }
  };
  useEffect(() => {
    //add event listener for clicks
    document.addEventListener("mousedown", handleClickOutside);
    return () =>{
        document.removeEventListener("mousedown", handleClickOutside);
    }
    
  },[]);
  

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile filter button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden border p-2 flex justify-center items-center cursor-pointer"
      >
        <FaFilter className="mr-2" /> Filters
      </button>
      {/* filter side bar */}
      <div
        ref={sidebarRef}
        className={`${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
      >
        <FilterBar />
      </div>
      <div className="flex-grow p-4 ">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* sort */}
        <SortOptions />

        {/* product grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
