package main

import (
	"errors"
	"fmt"

	"gorm.io/gorm"
	"gorm.io/driver/sqlite"
)

type User struct {
	ID        uint   `gorm:"primaryKey"`
    NuID      string `json:"nuid" gorm:"unique"`
    FirstName string `json:"firstName"`
    LastName  string `json:"lastName"`
    Email     string `json:"email" gorm:"unique"`
}

func initDB() *gorm.DB {
	fmt.Println("Opening db connection...")
	var err error
	db, err := gorm.Open(sqlite.Open("db.sqlite"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect database")
	}
	fmt.Println("Auto-Migrating tables...")
	db.AutoMigrate(&User{})
	return db
}

func (srv *Server) FindByEmail(email string) (user *User, err error) {
	user = &User{}
	res := srv.db.Where(&User{Email: email}).First(user)
	if errors.Is(res.Error, gorm.ErrRecordNotFound) {
		err = errors.New("User not found")
	}
	return
}
