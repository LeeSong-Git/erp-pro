package com.skyeye.dao;

import com.github.miemiedev.mybatis.paginator.domain.PageBounds;

import java.util.List;
import java.util.Map;

/**
 * @Author: 奈何繁华如云烟
 * @Description: TODO
 * @Date: 2019/9/14 10:45
 */
public interface StoreHouseDao {

    public List<Map<String, Object>> queryStoreHouseByList(Map<String, Object> params, PageBounds pageBounds) throws Exception;

    public Map<String, Object> queryStoreHouseByName(Map<String, Object> params) throws Exception;

    public void insertStoreHouse(Map<String, Object> params) throws Exception;

    public Map<String, Object> queryStoreHouseById(Map<String, Object> params) throws Exception;

    public void editStoreHouseById(Map<String, Object> params) throws Exception;

    public void editStoreHouseByDeleteFlag(Map<String, Object> params) throws Exception;

    public void editStoreHouseByDefault(Map<String, Object> params) throws Exception;

    public void editStoreHouseByDefaultAll(Map<String, Object> params) throws Exception;

    public Map<String, Object> queryStoreHouseByIdAndName(Map<String, Object> params) throws Exception;

    public Map<String, Object> queryStoreHouseByIsDefault(Map<String, Object> params) throws Exception;
}