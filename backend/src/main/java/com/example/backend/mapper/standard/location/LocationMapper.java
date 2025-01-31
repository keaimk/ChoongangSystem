package com.example.backend.mapper.standard.location;

import com.example.backend.dto.standard.location.Location;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface LocationMapper {

    @Select("""
            <script>
            SELECT 
                l.warehouse_code,
                l.row,
                l.col,
                l.shelf,
                l.location_key,
                l.location_note,
                w.warehouse_name
            FROM TB_LOCMST l
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            WHERE 
                    <if test="searchType == 'all'">
                        l.warehouse_code LIKE CONCAT('%',#{searchKeyword},'%')
                     OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.row LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.col LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.shelf LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.location_note LIKE CONCAT('%',#{searchKeyword},'%')
                    </if>
                    <if test="searchType != 'all'">
                         <choose>
                             <when test="searchType == 'warehouse'">
                                 l.warehouse_code LIKE CONCAT('%', #{searchKeyword}, '%')
                              OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                             </when>
                             <when test="searchType == 'row'">
                                 l.row LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <when test="searchType == 'col'">
                                 l.col LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <when test="searchType == 'shelf'">
                                 l.shelf LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <when test="searchType == 'note'">
                                 l.location_note LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <otherwise>
                           1 = 0
                        </otherwise>
                         </choose>
                     </if>
                ORDER BY
                <if test="sort != null and sort != ''">
                    ${sort} ${order}
                </if>
                <if test="sort == null">
                    l.warehouse_code DESC
                </if>
            LIMIT #{pageList},10    
            
            </script>
            """)
    List<Location> list(String searchType, String searchKeyword, Integer pageList, String sort, String order);

    @Insert("""
            INSERT INTO TB_LOCMST (warehouse_code, row, col, shelf, location_note)
            VALUES ( #{warehouseCode}, #{row}, #{col}, #{shelf}, #{locationNote} )
            """)
    int add(Location location);

    @Select("""
            <script>
            SELECT COUNT(*)
            FROM TB_LOCMST l
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            WHERE 
                    <if test="searchType == 'all'">
                        l.warehouse_code LIKE CONCAT('%',#{searchKeyword},'%')
                     OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.row LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.col LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.shelf LIKE CONCAT('%',#{searchKeyword},'%')
                     OR l.location_note LIKE CONCAT('%',#{searchKeyword},'%')
                    </if>
                    <if test="searchType != 'all'">
                         <choose>
                             <when test="searchType == 'warehouse'">
                                 l.warehouse_code LIKE CONCAT('%', #{searchKeyword}, '%')
                              OR w.warehouse_name LIKE CONCAT('%',#{searchKeyword},'%')
                             </when>
                             <when test="searchType == 'row'">
                                 l.row LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <when test="searchType == 'col'">
                                 l.col LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <when test="searchType == 'shelf'">
                                 l.shelf LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <when test="searchType == 'note'">
                                 l.location_note LIKE CONCAT('%', #{searchKeyword}, '%')
                             </when>
                             <otherwise>
                            1 = 0
                        </otherwise>
                         </choose>
                     </if>
            </script>
            """)
    Integer countAllLocation(String searchType, String searchKeyword);

    @Select("""
            <script>
            SELECT 
                l.warehouse_code,
                l.row,
                l.col,
                l.shelf,
                l.location_key,
                l.location_note,
                w.warehouse_name
            FROM TB_LOCMST l
            LEFT JOIN TB_WHMST w ON l.warehouse_code=w.warehouse_code
            WHERE l.location_key=#{locationKey}
            </script>
            """)
    Location view(Integer locationKey);

    @Update("""
            UPDATE TB_LOCMST
            SET warehouse_code=#{warehouseCode}, location_note=#{locationNote}
            WHERE location_key=#{locationKey}
            """)
    int edit(Location location);
}
