import React, { useState, useEffect } from "react";
import {
  FlatList,
  ActivityIndicator,
  Image,
  View,
  Text,
  SafeAreaView,
} from "react-native";
import { Stack, useRouter, useSearchParams } from "expo-router";
import axios from "axios";
import { COLORS, icons, SIZES } from "../../constants";
import styles from "../../styles/search";
import { NearbyJobCard, ScreenHeaderBtn } from "../../components";
import { TouchableOpacity } from "react-native-gesture-handler";

const JobSearch = () => {
  const params = useSearchParams();
  const router = useRouter();

  const [searchResult, setSearchResult] = useState([]);
  const [searchLoader, setSearchLoader] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [page, setPage] = useState(1);

  const handleSearch = async () => {
    setSearchLoader(true);
    setSearchResult([]);
    try {
      const options = {
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        params: {
          query: params.id,
          page: page.toString(),
        },
        headers: {
          "X-RapidAPI-Key":
            "d6534724dfmsha8a9d9f145c65a3p13dd63jsn44e6c3cd2398",
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      };
      const response = await axios.request(options);
      setSearchResult(response.data.data);
    } catch (error) {
      setSearchError(error);
      console.log(error);
    } finally {
      setSearchLoader(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handlePagination = (direction) => {
    if (direction === "left" && page > 1) {
      setPage(page - 1);
      handleSearch();
    } else if (direction === "right") {
      setPage(page + 1);
      handleSearch();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShawdowVisible: false,
          headerLeft: () => (
            <ScreenHeaderBtn
              iconUrl={icons.left}
              dimension="60%"
              handlePress={() => router.back()}
            />
          ),
          headerTitle: "",
        }}
      />
      <FlatList
        data={searchResult}
        renderItem={({ item }) => (
          <NearbyJobCard
            job={item}
            handleNavigate={() => router.push(`/job-details/${item.job_id}`)}
          />
        )}
        keyExtractor={(item) => item.job_id}
        contentContainerStyle={{
          padding: SIZES.medium,
          rowGap: SIZES.medium,
        }}
        ListHeaderComponent={() => (
          <>
            <View style={styles.container}>
              <Text style={styles.searchTitle}>{params.id}</Text>
              <Text style={styles.noOfSearchedJobs}>Job Opportunities</Text>
            </View>
            <View style={styles.loaderContainer}>
              {searchLoader ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                searchError && <Text>OOPS! something went wrong</Text>
              )}
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <>
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePagination("left")}
              >
                <Image
                  source={icons.chevronLeft}
                  resizeMode="contain"
                  style={styles.paginationImage}
                />
              </TouchableOpacity>
              <View style={styles.paginationText}>
                <Text style={styles.paginationText}>{page}</Text>
              </View>
              <TouchableOpacity
                style={styles.paginationButton}
                onPress={() => handlePagination("right")}
              >
                <Image
                  source={icons.chevronRight}
                  resizeMode="contain"
                  style={styles.paginationImage}
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      />
    </SafeAreaView>
  );
};

export default JobSearch;
