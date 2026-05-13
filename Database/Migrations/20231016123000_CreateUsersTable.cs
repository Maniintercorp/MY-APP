// Adjust SQL schema for Username to be non-nullable
using System;
using Microsoft.EntityFrameworkCore.Migrations;

public partial class CreateUsersTable : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Users",
            columns: table => new
            {
                UserId = table.Column<Guid>(nullable: false),
                Email = table.Column<string>(type: "VARCHAR(255)", nullable: false),
                PasswordHash = table.Column<string>(type: "VARCHAR(255)", nullable: false),
                Username = table.Column<string>(type: "VARCHAR(100)", nullable: false), // fixed
                CreatedAt = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETDATE()"),
                UpdatedAt = table.Column<DateTime>(type: "DATETIME2", nullable: false, defaultValueSql: "GETDATE()"),
                IsDeleted = table.Column<bool>(type: "BIT", nullable: false, defaultValue: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.UserId);
            }
        );

        migrationBuilder.CreateIndex(
            name: "IX_Users_Email",
            table: "Users",
            column: "Email",
            unique: true
        );
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(
            name: "Users"
        );
    }
}
