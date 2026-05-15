using Microsoft.EntityFrameworkCore.Migrations;

public partial class AddLoginUserManagementTables : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Users",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                Username = table.Column<string>(maxLength: 100, nullable: false),
                PasswordHash = table.Column<string>(maxLength: 255, nullable: false),
                Email = table.Column<string>(maxLength: 255, nullable: false),
                CreatedDate = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                CreatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                UpdatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                IsDeleted = table.Column<bool>(nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.Id);
                table.UniqueConstraint("AK_Users_Email", x => x.Email);
                table.UniqueConstraint("AK_Users_Username", x => x.Username);
            });

        migrationBuilder.CreateTable(
            name: "Roles",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                RoleName = table.Column<string>(maxLength: 50, nullable: false),
                CreatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                UpdatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                IsDeleted = table.Column<bool>(nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Roles", x => x.Id);
                table.UniqueConstraint("AK_Roles_RoleName", x => x.RoleName);
            });

        migrationBuilder.CreateTable(
            name: "UserRoles",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                UserId = table.Column<int>(nullable: false),
                RoleId = table.Column<int>(nullable: false),
                CreatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                UpdatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                IsDeleted = table.Column<bool>(nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserRoles", x => x.Id);
                table.ForeignKey(
                    name: "FK_UserRoles_Users",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                table.ForeignKey(
                    name: "FK_UserRoles_Roles",
                    column: x => x.RoleId,
                    principalTable: "Roles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "RefreshTokens",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("SqlServer:Identity", "1, 1"),
                UserId = table.Column<int>(nullable: false),
                Token = table.Column<string>(maxLength: 255, nullable: false),
                ExpirationDate = table.Column<DateTime>(nullable: false),
                CreatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                UpdatedAt = table.Column<DateTime>(nullable: false, defaultValueSql: "GETDATE()"),
                IsDeleted = table.Column<bool>(nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_RefreshTokens", x => x.Id);
                table.ForeignKey(
                    name: "FK_RefreshTokens_Users",
                    column: x => x.UserId,
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateIndex(
            name: "IX_Users_Email",
            table: "Users",
            column: "Email");

        migrationBuilder.CreateIndex(
            name: "IX_UserRoles_UserId",
            table: "UserRoles",
            column: "UserId");

        migrationBuilder.CreateIndex(
            name: "IX_RefreshTokens_UserId",
            table: "RefreshTokens",
            column: "UserId");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "RefreshTokens");

        migrationBuilder.DropTable(
            name: "UserRoles");

        migrationBuilder.DropTable(
            name: "Roles");

        migrationBuilder.DropTable(
            name: "Users");
    }
}
